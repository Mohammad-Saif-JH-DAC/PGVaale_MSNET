package com.pgvaale.backend.service;

import com.pgvaale.backend.dto.MenuDTO;
import com.pgvaale.backend.dto.TiffinDashboardDTO;
import com.pgvaale.backend.dto.UserTiffinDTO;
import com.pgvaale.backend.entity.Menu;
import com.pgvaale.backend.entity.Tiffin;
import com.pgvaale.backend.entity.User;
import com.pgvaale.backend.entity.UserTiffin;
import com.pgvaale.backend.repository.MenuRepository;
import com.pgvaale.backend.repository.TiffinRepository;
import com.pgvaale.backend.repository.UserRepository;
import com.pgvaale.backend.repository.UserTiffinRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TiffinService {
    @Autowired
    private TiffinRepository tiffinRepository;
    
    @Autowired
    private MenuRepository menuRepository;
    
    @Autowired
    private UserTiffinRepository userTiffinRepository;
    
    @Autowired
    private UserRepository userRepository;

    public List<Tiffin> getAllTiffins() {
        return tiffinRepository.findAll();
    }

    public Optional<Tiffin> getTiffinById(Long id) {
        return tiffinRepository.findById(id);
    }

    public Tiffin saveTiffin(Tiffin tiffin) {
        return tiffinRepository.save(tiffin);
    }

    public void deleteTiffin(Long id) {
        tiffinRepository.deleteById(id);
    }
    
    // Menu Management
    public MenuDTO createMenu(MenuDTO menuDTO) {
        Tiffin tiffin = tiffinRepository.findById(menuDTO.getTiffinId())
                .orElseThrow(() -> new RuntimeException("Tiffin not found"));
        
        Menu menu = Menu.builder()
                .tiffin(tiffin)
                .dayOfWeek(menuDTO.getDayOfWeek())
                .breakfast(menuDTO.getBreakfast())
                .lunch(menuDTO.getLunch())
                .dinner(menuDTO.getDinner())
                .menuDate(menuDTO.getMenuDate())
                .foodCategory(menuDTO.getFoodCategory())
                .price(menuDTO.getPrice())
                .isActive(true)
                .build();
        
        Menu savedMenu = menuRepository.save(menu);
        return convertToDTO(savedMenu);
    }
    
    public MenuDTO updateMenu(Long menuId, MenuDTO menuDTO) {
        Menu menu = menuRepository.findById(menuId)
                .orElseThrow(() -> new RuntimeException("Menu not found"));
        
        menu.setBreakfast(menuDTO.getBreakfast());
        menu.setLunch(menuDTO.getLunch());
        menu.setDinner(menuDTO.getDinner());
        menu.setMenuDate(menuDTO.getMenuDate());
        menu.setFoodCategory(menuDTO.getFoodCategory());
        menu.setPrice(menuDTO.getPrice());
        
        Menu updatedMenu = menuRepository.save(menu);
        return convertToDTO(updatedMenu);
    }
    
    public void deleteMenu(Long menuId) {
        Menu menu = menuRepository.findById(menuId)
                .orElseThrow(() -> new RuntimeException("Menu not found"));
        menu.setActive(false);
        menuRepository.save(menu);
    }
    
    public List<MenuDTO> getWeeklyMenu(Long tiffinId) {
        List<Menu> menus = menuRepository.findByTiffinIdAndIsActiveTrue(tiffinId);
        return menus.stream().map(this::convertToDTO).collect(Collectors.toList());
    }
    
    public MenuDTO getMenuByDay(Long tiffinId, String dayOfWeek) {
        Optional<Menu> menu = menuRepository.findByTiffinIdAndDayOfWeekAndIsActiveTrue(tiffinId, dayOfWeek);
        return menu.map(this::convertToDTO).orElse(null);
    }
    
    // User Request Management
    public UserTiffinDTO createUserRequest(Long userId, Long tiffinId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Tiffin tiffin = tiffinRepository.findById(tiffinId)
                .orElseThrow(() -> new RuntimeException("Tiffin not found"));
        
        // Check if request already exists
        Optional<UserTiffin> existingRequest = userTiffinRepository.findByUserIdAndTiffinId(userId, tiffinId);
        if (existingRequest.isPresent()) {
            throw new RuntimeException("Request already exists");
        }
        
        UserTiffin userTiffin = UserTiffin.builder()
                .user(user)
                .tiffin(tiffin)
                .status(UserTiffin.RequestStatus.PENDING)
                .assignedDateTime(LocalDateTime.now())
                .build();
        
        UserTiffin savedUserTiffin = userTiffinRepository.save(userTiffin);
        return UserTiffinDTO.fromEntity(savedUserTiffin);
    }
    
    public UserTiffinDTO updateRequestStatus(Long requestId, UserTiffin.RequestStatus status) {
        UserTiffin userTiffin = userTiffinRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        
        userTiffin.setStatus(status);
        if (status == UserTiffin.RequestStatus.REJECTED) {
            userTiffin.setDeletionDateTime(LocalDateTime.now());
        }
        
        UserTiffin updatedUserTiffin = userTiffinRepository.save(userTiffin);
        return UserTiffinDTO.fromEntity(updatedUserTiffin);
    }
    
    public List<UserTiffinDTO> getTiffinRequests(Long tiffinId, UserTiffin.RequestStatus status) {
        List<UserTiffin> userTiffins;
        if (status == null) {
            userTiffins = userTiffinRepository.findByTiffinId(tiffinId);
        } else {
            userTiffins = userTiffinRepository.findByTiffinIdAndStatusOrderByAssignedDateTimeDesc(tiffinId, status);
        }
        return userTiffins.stream().map(UserTiffinDTO::fromEntity).collect(Collectors.toList());
    }
    
    public List<UserTiffinDTO> getUserRequests(Long userId, UserTiffin.RequestStatus status) {
        List<UserTiffin> userTiffins;
        if (status == null) {
            userTiffins = userTiffinRepository.findByUserId(userId);
        } else {
            userTiffins = userTiffinRepository.findByUserIdAndStatusOrderByAssignedDateTimeDesc(userId, status);
        }
        return userTiffins.stream().map(UserTiffinDTO::fromEntity).collect(Collectors.toList());
    }
    
    public void cancelUserRequest(Long requestId) {
        UserTiffin userTiffin = userTiffinRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        
        userTiffin.setStatus(UserTiffin.RequestStatus.REJECTED);
        userTiffin.setDeletionDateTime(LocalDateTime.now());
        userTiffinRepository.save(userTiffin);
    }
    
    // Dashboard
    public TiffinDashboardDTO getTiffinDashboard(Long tiffinId) {
        Tiffin tiffin = tiffinRepository.findById(tiffinId)
                .orElseThrow(() -> new RuntimeException("Tiffin not found"));
        
        Long pendingRequests = userTiffinRepository.countByTiffinIdAndStatus(tiffinId, UserTiffin.RequestStatus.PENDING);
        Long acceptedRequests = userTiffinRepository.countByTiffinIdAndStatus(tiffinId, UserTiffin.RequestStatus.ACCEPTED);
        Long rejectedRequests = userTiffinRepository.countByTiffinIdAndStatus(tiffinId, UserTiffin.RequestStatus.REJECTED);
        
        List<UserTiffinDTO> recentRequests = userTiffinRepository.findByTiffinId(tiffinId)
                .stream()
                .limit(5)
                .map(UserTiffinDTO::fromEntity)
                .collect(Collectors.toList());
        
        return TiffinDashboardDTO.builder()
                .tiffinName(tiffin.getName())
                .pendingRequests(pendingRequests)
                .acceptedRequests(acceptedRequests)
                .rejectedRequests(rejectedRequests)
                .averageRating(0.0) // TODO: Implement rating system
                .recentRequests(recentRequests)
                .build();
    }
    
    private MenuDTO convertToDTO(Menu menu) {
        return MenuDTO.builder()
                .id(menu.getId())
                .tiffinId(menu.getTiffin().getId())
                .dayOfWeek(menu.getDayOfWeek())
                .breakfast(menu.getBreakfast())
                .lunch(menu.getLunch())
                .dinner(menu.getDinner())
                .menuDate(menu.getMenuDate())
                .foodCategory(menu.getFoodCategory())
                .price(menu.getPrice())
                .isActive(menu.isActive())
                .build();
    }
} 